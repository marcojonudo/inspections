package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import inspections.domains.GaragePosition
import inspections.domains.VehicleSection
import org.grails.datastore.gorm.GormEntity

@Entity
class ItemVehicleData implements GormEntity<ItemVehicleData> {

	@JsonIgnore
	Item item

	String vehicle
	GaragePosition garagePosition
	VehicleSection vehicleSection

	static belongsTo = Item

	static constraints = {
		garagePosition nullable: true
		vehicleSection nullable: true
	}

	static mapping = {
		garagePosition lazy: false
		vehicleSection lazy: false
	}

}
