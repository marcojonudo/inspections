package inspections.domains

import grails.gorm.annotation.Entity
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity
import org.grails.datastore.mapping.core.connections.ConnectionSource

@Entity
class ItemCategory implements GormEntity<ItemCategory> {

	String code
	String name
	int order

	static constraints = {
		code maxSize: 15
		name maxSize: 45
	}

	static mapping = {
		order column: '`order`'
	}

}
