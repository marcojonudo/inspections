package inspections.domains

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class ItemCategory implements GormEntity<ItemCategory> {

	String code
	String name

	static constraints = {
		code maxSize: 15
		name maxSize: 45
	}

}
