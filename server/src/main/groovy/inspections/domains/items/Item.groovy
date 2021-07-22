package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import inspections.domains.*
import inspections.domains.savedItems.SavedItem
import inspections.domains.savedItems.SelectSavedItem
import inspections.domains.savedItems.TextSavedItem
import inspections.pogos.Builder
import inspections.services.data.SavedItemDataService
import org.grails.datastore.gorm.GormEntity

@Entity
class Item implements GormEntity<Item> {

	Type type
	String code
	String name
	Integer order
	ItemCategory category
	GaragePosition garagePosition
	VehicleSection vehicleSection
	boolean required

	@JsonIgnore
	Set<Inspection> inspections

	@JsonInclude
	Set<ItemRelation> relations

	static hasMany = [inspections: Inspection, relations: ItemRelation]

	static belongsTo = Inspection

	static constraints = {
		type maxSize: 25
		order nullable: true
		category nullable: true
		garagePosition nullable: true
		vehicleSection nullable: true
	}

	static mapping = {
		tablePerHierarchy false

		order column: '`order`'
		category lazy: false
		garagePosition lazy: false
		vehicleSection lazy: false
		relations fetch: 'join'
	}

	enum Type {

		TEXT({ Map<String, Object> item ->
			return Builder.buildTextSavedItem(item)
		}, { Serializable id, TextSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.textSavedItemDataService.update(
				id, savedItem.text, savedItem.employeeCode, savedItem.hidden, savedItem.filled
			)
		}),
		SELECT({ Map<String, Object> item ->
			return Builder.buildSelectSavedItem(item)
		}, { Serializable id, SelectSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.selectSavedItemDataService.update(
				id, savedItem.value, savedItem.employeeCode, savedItem.hidden, savedItem.filled
			)
		}),
		TEXT_AREA({ Map<String, Object> item ->
			return Builder.buildTextSavedItem(item)
		}, { Serializable id, TextSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.textSavedItemDataService.update(
				id, savedItem.text, savedItem.employeeCode, savedItem.hidden, savedItem.filled
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
