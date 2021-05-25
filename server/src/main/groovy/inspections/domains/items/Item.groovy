package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import inspections.domains.GaragePosition
import inspections.domains.Inspection
import inspections.domains.ItemCategory
import inspections.domains.VehiclePosition
import inspections.domains.savedItems.SavedItem
import inspections.pogos.Builder
import org.grails.datastore.gorm.GormEntity

@Entity
class Item implements GormEntity<Item> {

	Type type
	String name
	int order
	ItemCategory category
	GaragePosition garagePosition

	@JsonIgnore
	Set<Inspection> inspections

	@JsonInclude
	Set<VehiclePosition> vehiclePositions

	static hasMany = [inspections: Inspection, vehiclePositions: VehiclePosition]

	static belongsTo = Inspection

	static constraints = {
		type maxSize: 25
	}

	static mapping = {
		tablePerHierarchy false

		order column: '`order`'
		category lazy: false
		garagePosition lazy: false
		vehiclePositions fetch: 'join'
	}

	enum Type {

		TEXT({ Map<String, Object> item ->
			return Builder.buildTextSavedItem(item)
		}),
		SELECT({ Map<String, Object> item ->
			return Builder.buildSelectSavedItem(item)
		})

		Closure<SavedItem> buildSavedItem

		Type(Closure<SavedItem> buildSavedItem) {
			this.buildSavedItem = buildSavedItem
		}

	}

}
