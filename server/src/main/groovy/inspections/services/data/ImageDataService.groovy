package inspections.services.data

import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.domains.Image
import inspections.domains.SavedInspection

import javax.inject.Inject

@Service(Image)
abstract class ImageDataService {

	@Inject SavedInspectionDataService savedInspectionDataService

	abstract Image find(Serializable id)

	abstract Image find(Long savedInspectionId, String itemCode)

	@Where({ id in ids })
	abstract List<Image> findAll(List<Long> ids)

	abstract Image save(Long savedInspectionId, String itemCode, byte[] image, boolean landscape)

	abstract void delete(Serializable id)

	Image save(int orderNumber, String itemCode, byte[] image, boolean landscape) {
		SavedInspection savedInspection = savedInspectionDataService.find(orderNumber)
		return save(savedInspection.id, itemCode, image, landscape)
	}

}
