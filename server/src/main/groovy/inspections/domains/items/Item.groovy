package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import inspections.domains.GaragePosition
import inspections.domains.Inspection
import inspections.domains.ItemCategory
import inspections.domains.VehicleSection
import inspections.domains.savedItems.SavedItem
import inspections.domains.savedItems.SelectSavedItem
import inspections.domains.savedItems.TextSavedItem
import inspections.pogos.Builder
import inspections.services.data.SavedItemDataService
import org.grails.datastore.gorm.GormEntity

@Entity
class Item implements GormEntity<Item> {

	Type type
	String name
	int order
	ItemCategory category
	GaragePosition garagePosition
	VehicleSection vehicleSection

	@JsonIgnore
	Set<Inspection> inspections

	static hasMany = [inspections: Inspection]

	static belongsTo = Inspection

	static constraints = {
		type maxSize: 25
		vehicleSection nullable: true
	}

	static mapping = {
		tablePerHierarchy false

		order column: '`order`'
		category lazy: false
		garagePosition lazy: false
		vehicleSection lazy: false
	}

	enum Type {

		TEXT({ Map<String, Object> item ->
			return Builder.buildTextSavedItem(item)
		}, { Serializable id, TextSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.textSavedItemDataService.update(
				id, savedItem.text, savedItem.employeeCode, savedItem.filled
			)
		}),
		SELECT({ Map<String, Object> item ->
			return Builder.buildSelectSavedItem(item)
		}, { Serializable id, SelectSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.selectSavedItemDataService.update(
				id, savedItem.value, savedItem.employeeCode, savedItem.filled
			)
		})

		Closure<SavedItem> buildSavedItem
		Closure<SavedItem> updateSavedItem

		Type(Closure<SavedItem> buildSavedItem, Closure<SavedItem> updateSavedItem) {
			this.buildSavedItem = buildSavedItem
			this.updateSavedItem = updateSavedItem
		}

	}

}
