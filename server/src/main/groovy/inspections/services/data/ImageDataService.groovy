package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.Image

@Service(Image)
interface ImageDataService {

	Image update(Serializable id, byte[] image, boolean landscape)

	void delete(Serializable id)

}
