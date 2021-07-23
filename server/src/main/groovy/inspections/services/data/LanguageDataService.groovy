package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.Language

@Service(Language)
interface LanguageDataService {

	String findLanguageLang()

}
