package inspections.domains

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class Image implements GormEntity<Image> {

	Long savedInspectionId
	String itemCode
	byte[] image
	boolean landscape

	static constraints = {
		savedInspectionId nullable: true
		itemCode nullable: true
	}

	@Override
	boolean equals(Object obj) {
		Image img = (Image) obj
		return image == img.image && landscape == img.landscape
	}

}
