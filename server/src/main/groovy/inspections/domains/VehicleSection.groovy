package inspections.domains

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class VehicleSection implements GormEntity<VehicleSection> {

	String code
	String name

	static constraints = {
		name maxSize: 45
	}

}
