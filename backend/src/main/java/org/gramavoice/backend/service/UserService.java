package org.gramavoice.backend.service;

import org.gramavoice.backend.model.User;
import org.gramavoice.backend.model.UserRole;
import org.gramavoice.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User getByUsername(String username) {
        return findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    public User save(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        if (user.getMobileNumber() != null && !user.getMobileNumber().isBlank() && userRepository.existsByMobileNumber(user.getMobileNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mobile number already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateProfile(String username, String fullName, String mobileNumber, String village, String district) {
        User user = getByUsername(username);
        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName);
        }
        if (mobileNumber != null && !mobileNumber.isBlank() && !mobileNumber.equals(user.getMobileNumber())) {
            if (userRepository.existsByMobileNumber(mobileNumber)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Mobile number already exists");
            }
            user.setMobileNumber(mobileNumber);
        }
        if (village != null) {
            user.setVillage(village);
        }
        if (district != null) {
            user.setDistrict(district);
        }
        return userRepository.save(user);
    }

    public void initializeUsers() {
        ensureCitizen("citizen", "password", "குடிமக்கள்", "9876500000");
        ensureAdmin("admin", "admin123", "மாவட்ட நிர்வாகி");
        initializeDepartmentUsers();
    }

    public void initializeDepartmentUsers() {
        for (DepartmentSeed seed : DEPARTMENT_SEEDS) {
            ensureOfficer(seed.username(), seed.password(), seed.fullName(), seed.departmentCode());
        }
    }

    private void ensureCitizen(String username, String password, String fullName, String mobile) {
        createSeedUserIfMissing(username, password, fullName, mobile, "சோழவந்தான்", "மதுரை", UserRole.CITIZEN, null);
    }

    private void ensureAdmin(String username, String password, String fullName) {
        createSeedUserIfMissing(username, password, fullName, "9000000099", "மதுரை", "மதுரை", UserRole.ADMIN, null);
    }

    private void ensureOfficer(String username, String password, String fullName, String departmentCode) {
        ensureManagedSeedUser(username, password, fullName, "9000000000", "மதுரை", "மதுரை", UserRole.OFFICER, departmentCode);
    }

    private void createSeedUserIfMissing(
            String username,
            String password,
            String fullName,
            String mobile,
            String village,
            String district,
            UserRole role,
            String departmentCode
    ) {
        userRepository.findByUsername(username)
                .orElseGet(() -> createSeedUser(username, password, fullName, mobile, village, district, role, departmentCode));
    }

    private void ensureManagedSeedUser(
            String username,
            String password,
            String fullName,
            String mobile,
            String village,
            String district,
            UserRole role,
            String departmentCode
    ) {
        userRepository.findByUsername(username).ifPresentOrElse(
                user -> syncManagedSeedUser(user, password, fullName, mobile, village, district, role, departmentCode),
                () -> createSeedUser(username, password, fullName, mobile, village, district, role, departmentCode)
        );
    }

    private User createSeedUser(
            String username,
            String password,
            String fullName,
            String mobile,
            String village,
            String district,
            UserRole role,
            String departmentCode
    ) {
        User user = new User(username, password, fullName, mobile, village, district, role);
        if (departmentCode != null) {
            user.setDepartmentCode(departmentCode);
        }
        user.setPassword(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    private void syncManagedSeedUser(
            User user,
            String password,
            String fullName,
            String mobile,
            String village,
            String district,
            UserRole role,
            String departmentCode
    ) {
        boolean changed = false;

        if (!passwordEncoder.matches(password, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(password));
            changed = true;
        }
        if (!fullName.equals(user.getFullName())) {
            user.setFullName(fullName);
            changed = true;
        }
        if (!mobile.equals(user.getMobileNumber())) {
            user.setMobileNumber(mobile);
            changed = true;
        }
        if (!village.equals(user.getVillage())) {
            user.setVillage(village);
            changed = true;
        }
        if (!district.equals(user.getDistrict())) {
            user.setDistrict(district);
            changed = true;
        }
        if (user.getRole() != role) {
            user.setRole(role);
            changed = true;
        }
        if (departmentCode != null && !departmentCode.equals(user.getDepartmentCode())) {
            user.setDepartmentCode(departmentCode);
            changed = true;
        }

        if (changed) {
            userRepository.save(user);
        }
    }

    private record DepartmentSeed(String username, String password, String fullName, String departmentCode) {}

    private static final List<DepartmentSeed> DEPARTMENT_SEEDS = List.of(
            new DepartmentSeed("water", "water123", "குடிநீர் துறை அலுவலர்", "WATER"),
            new DepartmentSeed("electricity", "electricity123", "மின்சார துறை அலுவலர்", "ELECTRICITY"),
            new DepartmentSeed("roads", "roads123", "சாலை துறை அலுவலர்", "ROADS"),
            new DepartmentSeed("municipal", "municipal123", "ஊராட்சி அலுவலர்", "MUNICIPAL"),
            new DepartmentSeed("ration", "ration123", "ரேஷன் துறை அலுவலர்", "RATION"),
            new DepartmentSeed("general", "general123", "பொது சேவை அலுவலர்", "GENERAL")
    );
}
