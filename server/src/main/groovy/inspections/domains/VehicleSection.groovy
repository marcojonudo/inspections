package inspections.domains

import grails.gorm.annotation.Entity
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity
import org.grails.datastore.mapping.core.connections.ConnectionSource

@Entity
class VehicleSection implements GormEntity<VehicleSection> {

	String code
	String name
	int order

	static constraints = {
		name maxSize: 45
	}

	static mapping = {
		order column: '`order`'
	}

}
