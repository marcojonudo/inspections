package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import inspections.domains.InspectionVehicle
import inspections.domains.ItemCategory
import inspections.domains.ItemRelation
import inspections.domains.savedItems.SavedItem
import inspections.domains.savedItems.SelectSavedItem
import inspections.domains.savedItems.TextSavedItem
import inspections.services.data.SavedItemDataService
import inspections.utils.Builder
import org.grails.datastore.gorm.GormEntity

@Entity
class Item implements GormEntity<Item> {

	Type type
	String code
	String name
	Integer order
	Integer printOrder
	ItemCategory category
	boolean required
	HeaderCard header

	@JsonIgnore
	Set<InspectionVehicle> inspectionsVehicle

	@JsonIgnore
	Set<ItemVehicleData> vehicleDataList

	@JsonInclude
	Set<ItemRelation> relations

	ItemVehicleData vehicleData

	static hasMany = [inspectionsVehicle: InspectionVehicle, vehicleDataList: ItemVehicleData, relations: ItemRelation]

	static belongsTo = InspectionVehicle

	static transients = ['vehicleData']

	static constraints = {
		type maxSize: 25
		order nullable: true
		category nullable: true
		header nullable: true
	}

	static mapping = {
		tablePerHierarchy false

		order column: '`order`'
		category lazy: false
		vehicleDataList fetch: 'join'
		relations fetch: 'join'
	}

	enum Type {

		TEXT({ Map<String, Object> item ->
			return Builder.buildTextSavedItem(item)
		}, { Serializable id, TextSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.textSavedItemDataService.update(id, savedItem.text)
		}),
		SELECT({ Map<String, Object> item ->
			return Builder.buildSelectSavedItem(item)
		}, { Serializable id, SelectSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.selectSavedItemDataService.update(id, savedItem.value)
		}),
		TEXT_AREA({ Map<String, Object> item ->
			return Builder.buildTextSavedItem(item)
		}, { Serializable id, TextSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.textSavedItemDataService.update(id, savedItem.text)
		})

		Closure<SavedItem> buildSavedItem
		Closure<SavedItem> updateSavedItem

		Type(Closure<SavedItem> buildSavedItem, Closure<SavedItem> updateSavedItem) {
			this.buildSavedItem = buildSavedItem
			this.updateSavedItem = updateSavedItem
		}

	}

	enum HeaderCard {

		INFO,
		CENTRE,
		VEHICLE

	}

}
