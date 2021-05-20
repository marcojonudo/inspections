package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import inspections.domains.GaragePosition
import inspections.domains.Inspection
import inspections.domains.ItemCategory
import inspections.domains.VehiclePosition
import org.grails.datastore.gorm.GormEntity

@Entity
class Item implements GormEntity<Item> {

	String code
	Type type
	String name
	ItemCategory category

	@JsonIgnore
	Set<Inspection> inspections

	@JsonInclude
	Set<VehiclePosition> vehiclePositions

	static hasMany = [inspections: Inspection, garagePositions: GaragePosition, vehiclePositions: VehiclePosition]

	static belongsTo = Inspection

	static constraints = {
		code maxSize: 15
		type maxSize: 25
	}

	static mapping = {
		tablePerHierarchy false

		category lazy: false
		garagePositions fetch: 'join'
		vehiclePositions fetch: 'join'
	}

	enum Type {

		TEXT,
		SELECT

	}

}
