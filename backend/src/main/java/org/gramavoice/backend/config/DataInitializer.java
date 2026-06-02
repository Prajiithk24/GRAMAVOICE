package org.gramavoice.backend.config;

import org.gramavoice.backend.dto.ComplaintCreateRequest;
import org.gramavoice.backend.model.Announcement;
import org.gramavoice.backend.model.CategoryRule;
import org.gramavoice.backend.model.Department;
import org.gramavoice.backend.model.FaqItem;
import org.gramavoice.backend.model.KnowledgeArticle;
import org.gramavoice.backend.model.UserAccount;
import org.gramavoice.backend.model.UserRole;
import org.gramavoice.backend.repository.AnnouncementRepository;
import org.gramavoice.backend.repository.CategoryRuleRepository;
import org.gramavoice.backend.repository.DepartmentRepository;
import org.gramavoice.backend.repository.FaqItemRepository;
import org.gramavoice.backend.repository.KnowledgeArticleRepository;
import org.gramavoice.backend.repository.UserAccountRepository;
import org.gramavoice.backend.service.ComplaintService;
import org.gramavoice.backend.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(
            DepartmentRepository departmentRepository,
            CategoryRuleRepository categoryRuleRepository,
            UserAccountRepository userAccountRepository,
            AnnouncementRepository announcementRepository,
            FaqItemRepository faqItemRepository,
            KnowledgeArticleRepository knowledgeArticleRepository,
            ComplaintService complaintService,
            UserService userService
    ) {
        return args -> {
            if (departmentRepository.count() == 0) {
                departmentRepository.saveAll(List.of(
                        department("WATER", "குடிநீர் துறை", "மதுரை", "18001231001", 24, "குடிநீர், குழாய், தொட்டி, குடிநீர் விநியோகம் தொடர்பான குறைகள்"),
                        department("ELECTRICITY", "மின்சார துறை", "மதுரை", "18001231002", 12, "மின்விநியோகம், கம்பம், விளக்கு, மின் துண்டிப்பு குறைகள்"),
                        department("ROADS", "சாலை மற்றும் போக்குவரத்து துறை", "மதுரை", "18001231003", 48, "சாலை சேதம், குழி, பேருந்து நிறுத்தம், நடைபாதை குறைகள்"),
                        department("MUNICIPAL", "ஊராட்சி மற்றும் நகராட்சி சேவை மையம்", "மதுரை", "18001231004", 36, "குப்பை, கழிவுநீர், தெருவிளக்கு, பொது சுத்தம் குறைகள்"),
                        department("RATION", "உணவுப் பொருள் வழங்கல் துறை", "மதுரை", "18001231005", 24, "ரேஷன் பொருள், அட்டை சேவை, வழங்கல் குறைகள்"),
                        department("GENERAL", "மக்கள் சேவை மையம்", "மதுரை", "18001231006", 36, "பிற சேவை குறைகள்")
                ));
            }

            if (categoryRuleRepository.count() == 0) {
                categoryRuleRepository.saveAll(List.of(
                        category("WATER_SHORTAGE", "குடிநீர் பற்றாக்குறை", "WATER", "குடிநீர் துறை", "HIGH", "தண்ணீர்,குடிநீர்,குழாய்,பம்பு,தொட்டி,விநியோகம்"),
                        category("ELECTRICITY_OUTAGE", "மின்தடை மற்றும் இணைப்பு குறை", "ELECTRICITY", "மின்சார துறை", "CRITICAL", "மின்,மின்சாரம்,மின்தடை,கம்பம்,மின்விளக்கு,இணைப்பு"),
                        category("ROAD_DAMAGE", "சாலை சேதம்", "ROADS", "சாலை மற்றும் போக்குவரத்து துறை", "HIGH", "சாலை,குழி,தார்,பாதை,பேருந்து"),
                        category("SANITATION", "சுத்தம் மற்றும் கழிவுநீர்", "MUNICIPAL", "ஊராட்சி மற்றும் நகராட்சி சேவை மையம்", "MEDIUM", "குப்பை,கழிவுநீர்,துர்நாற்றம்,வடிகால்,சுத்தம்"),
                        category("STREETLIGHT", "தெருவிளக்கு குறை", "MUNICIPAL", "ஊராட்சி மற்றும் நகராட்சி சேவை மையம்", "MEDIUM", "தெருவிளக்கு,விளக்கு,இருள்,கம்பம்"),
                        category("RATION_SUPPLY", "ரேஷன் விநியோக குறை", "RATION", "உணவுப் பொருள் வழங்கல் துறை", "HIGH", "ரேஷன்,அரிசி,சர்க்கரை,விநியோகம்,கடை,அட்டை"),
                        category("GENERAL", "பொது சேவை குறை", "GENERAL", "மக்கள் சேவை மையம்", "MEDIUM", "பள்ளி,மருத்துவம்,பேருந்து,உதவி,அலுவலகம்")
                ));
            }

            if (userAccountRepository.count() == 0) {
                userAccountRepository.saveAll(List.of(
                        user("முத்துசாமி", "9876543210", "சோழவந்தான்", "மதுரை", UserRole.CITIZEN),
                        user("மலர்விழி", "9876543211", "அலங்காநல்லூர்", "மதுரை", UserRole.CITIZEN),
                        user("காவேரி அதிகாரி", "9000000001", "மதுரை", "மதுரை", UserRole.OFFICER),
                        user("மாவட்ட நிர்வாகி", "9000000002", "மதுரை", "மதுரை", UserRole.ADMIN)
                ));
            }

            if (announcementRepository.count() == 0) {
                announcementRepository.saveAll(List.of(
                        announcement("குடிநீர் வழங்கல் நேர மாற்றம்", "நாளை காலை ஆறு மணி முதல் எட்டு மணி வரை மட்டுமே குடிநீர் வழங்கப்படும்.", "சோழவந்தான்"),
                        announcement("தெருவிளக்கு பராமரிப்பு பணி", "மேற்கு தெருவில் இரவு ஒன்பது மணி வரை பராமரிப்பு பணி நடைபெறும்.", "அலங்காநல்லூர்"),
                        announcement("மக்கள் சந்திப்பு நாள்", "ஒவ்வோர் புதன்கிழமையும் மக்கள் சந்திப்பு காலை பத்து மணி முதல் மதியம் ஒரு மணி வரை நடைபெறும்.", "மதுரை")
                ));
            }

            if (faqItemRepository.count() == 0) {
                faqItemRepository.saveAll(List.of(
                        faq(1, "குறை பதிவு செய்ய என்ன தேவை?", "பெயர், கைபேசி எண், குறை விவரம் மற்றும் இடம் மட்டும் போதுமானது."),
                        faq(2, "தமிழில் பேசி குறை பதிவு செய்ய முடியுமா?", "ஆம். குரல் பதிவு வசதி மூலம் தமிழில் நேராக பதிவு செய்யலாம்."),
                        faq(3, "குறை எந்த துறைக்கு செல்கிறது என்பதை நான் தேர்வு செய்ய வேண்டுமா?", "வேண்டாம். முறைமை தானாக வகைப்படுத்தி பொருத்தமான துறைக்கு அனுப்பும்."),
                        faq(4, "என் குறையின் நிலையை எங்கே பார்க்கலாம்?", "குறை எண் அல்லது உங்கள் கைபேசி எண்ணைப் பயன்படுத்தி நிலை கண்காணிப்பு பக்கத்தில் பார்க்கலாம்.")
                ));
            }

            if (knowledgeArticleRepository.count() == 0) {
                knowledgeArticleRepository.saveAll(List.of(
                        article("குறை பதிவு செய்யும் சிறந்த நடைமுறை", "சரியான இடம், காலம், பாதிப்பு அளவு போன்றவற்றை சேர்த்தால் நடவடிக்கை வேகமாகும்.", "குறை பதிவு செய்யும்போது தெரு பெயர், அருகிலுள்ள அடையாளம், பாதிப்பு எவ்வளவு பேர் மீது உள்ளது போன்ற விவரங்களை தெளிவாக கூறுங்கள்.", "அனைவருக்கும்"),
                        article("குரல் பதிவு பயன் பெறும் வழி", "தெளிவாக மற்றும் மெதுவாக பேசினால் உரைமாற்றம் மேலும் துல்லியமாகும்.", "பின்னணி சத்தம் இல்லாத இடத்தில் பேசவும். ஒரு பிரச்சினைக்கு ஒரு பதிவு என்ற முறையில் கூறவும்.", "குடிமக்கள்"),
                        article("துறை ஒதுக்கீடு எப்படி நடக்கிறது", "குறையில் வரும் சொற்களை வைத்து முறைமை துறை தேர்வு செய்கிறது.", "குடிநீர், மின்சாரம், சாலை, ரேஷன் போன்ற முக்கிய சொற்கள் கண்டறியப்பட்டு குறை பொருத்தமான அலுவலகத்திற்கு அனுப்பப்படும்.", "அலுவலர்கள்")
                ));
            }

            if (complaintService.listAll(null, null).isEmpty()) {
                complaintService.createComplaint(new ComplaintCreateRequest(
                        "முத்துசாமி",
                        "9876543210",
                        "குடிநீர் வரவில்லை",
                        "எங்கள் தெருவில் மூன்று நாட்களாக குடிநீர் வரவில்லை. குழந்தைகள் மிகவும் சிரமப்படுகின்றனர்.",
                        "எங்கள் தெருவில் மூன்று நாட்களாக குடிநீர் வரவில்லை",
                        "சோழவந்தான்",
                        "மதுரை",
                        "மேற்கு தெரு",
                        "",
                        "VOICE"
                ));

                complaintService.createComplaint(new ComplaintCreateRequest(
                        "மலர்விழி",
                        "9876543211",
                        "தெருவிளக்கு எரியவில்லை",
                        "பள்ளி அருகே தெருவிளக்கு இரண்டு நாட்களாக எரியவில்லை. இரவில் பயமாக இருக்கிறது.",
                        "பள்ளி அருகே தெருவிளக்கு இரண்டு நாட்களாக எரியவில்லை",
                        "அலங்காநல்லூர்",
                        "மதுரை",
                        "பள்ளி தெரு",
                        "",
                        "VOICE"
                ));
            }

            userService.initializeUsers();
        };
    }

    private Department department(String code, String nameTa, String district, String contact, int slaHours, String descriptionTa) {
        Department department = new Department();
        department.setCode(code);
        department.setNameTa(nameTa);
        department.setDistrict(district);
        department.setContactNumber(contact);
        department.setSlaHours(slaHours);
        department.setDescriptionTa(descriptionTa);
        return department;
    }

    private CategoryRule category(String code, String nameTa, String departmentCode, String departmentNameTa, String priorityCode, String keywordsTa) {
        CategoryRule rule = new CategoryRule();
        rule.setCode(code);
        rule.setNameTa(nameTa);
        rule.setDepartmentCode(departmentCode);
        rule.setDepartmentNameTa(departmentNameTa);
        rule.setPriorityCode(priorityCode);
        rule.setKeywordsTa(keywordsTa);
        return rule;
    }

    private UserAccount user(String fullName, String mobile, String village, String district, UserRole role) {
        UserAccount account = new UserAccount();
        account.setFullName(fullName);
        account.setMobileNumber(mobile);
        account.setVillage(village);
        account.setDistrict(district);
        account.setRole(role);
        return account;
    }

    private Announcement announcement(String titleTa, String contentTa, String areaNameTa) {
        Announcement announcement = new Announcement();
        announcement.setTitleTa(titleTa);
        announcement.setContentTa(contentTa);
        announcement.setAreaNameTa(areaNameTa);
        announcement.setActive(true);
        return announcement;
    }

    private FaqItem faq(int order, String questionTa, String answerTa) {
        FaqItem item = new FaqItem();
        item.setDisplayOrder(order);
        item.setQuestionTa(questionTa);
        item.setAnswerTa(answerTa);
        return item;
    }

    private KnowledgeArticle article(String titleTa, String summaryTa, String contentTa, String audienceTa) {
        KnowledgeArticle article = new KnowledgeArticle();
        article.setTitleTa(titleTa);
        article.setSummaryTa(summaryTa);
        article.setContentTa(contentTa);
        article.setAudienceTa(audienceTa);
        return article;
    }
}
