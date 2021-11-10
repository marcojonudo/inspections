package inspections.domains

import grails.gorm.annotation.Entity
import groovy.transform.TupleConstructor
import inspections.domains.items.Item
import org.grails.datastore.gorm.GormEntity

@Entity
@TupleConstructor
class InspectionVehicle implements GormEntity<InspectionVehicle> {

	InspectionType inspectionType
	String vehicle
	Set<Item> items
	boolean orderInspection

	static hasMany = [items: Item, articleCodes: ArticleCodeInspection]

	static transients = ['orderInspection']

	static mapping = {
		inspectionType lazy: false
		items fetch: 'join'
		articleCodes fetch: 'join'
	}

	enum Vehicle {

		CAR

	}

}
