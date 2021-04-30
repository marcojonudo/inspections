package inspections.domains

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import inspections.domains.items.Item
import org.grails.datastore.gorm.GormEntity

@Entity
class VehiclePosition implements GormEntity<VehiclePosition> {

	String code
	String name

	@JsonIgnore
	Set<Item> items

	static hasMany = [items: Item]

	static belongsTo = Item

	static constraints = {
		name maxSize: 45
	}

	static mapping = {
		items lazy: false
	}

}
