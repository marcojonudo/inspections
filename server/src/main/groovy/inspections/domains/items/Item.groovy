package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import inspections.domains.InspectionVehicle
import inspections.domains.ItemCategory
import inspections.domains.ItemRelation
import inspections.domains.savedItems.SavedItem
import inspections.domains.savedItems.SelectSavedItem
import inspections.domains.savedItems.TextAreaSavedItem
import inspections.domains.savedItems.TextSavedItem
import inspections.services.data.SavedItemDataService
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class Item implements GormEntity<Item> {

	Type type
	String code
	String name
	String shortName
	Integer order
	Integer printOrder
	ItemCategory category
	boolean required
	HeaderCard header
	boolean picture
	boolean print

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
		shortName nullable: true
		order nullable: true
		printOrder nullable: true
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

		TEXT(
			TextItem,
			TextSavedItem,
			{ TextSavedItem existent, TextSavedItem savedItem, SavedItemDataService savedItemDataService ->
				return savedItemDataService.textSavedItemDataService.update(existent, savedItem.fields)
			}),
		SELECT(
			SelectItem,
			SelectSavedItem,
			{ SelectSavedItem existent, SelectSavedItem savedItem, SavedItemDataService savedItemDataService ->
				return savedItemDataService.selectSavedItemDataService.update(existent.id, savedItem.value)
			}),
		TEXT_AREA(
			TextAreaItem,
			TextAreaSavedItem,
			{ TextAreaSavedItem existent, TextAreaSavedItem savedItem, SavedItemDataService savedItemDataService ->
				return savedItemDataService.textAreaSavedItemDataService.update(existent.id, savedItem.text)
			})

		Class clazz
		Class savedItemClazz
		Closure<SavedItem> updateSavedItem

		Type(Class clazz, Class savedItemClazz, Closure<SavedItem> updateSavedItem) {
			this.clazz = clazz
			this.savedItemClazz = savedItemClazz
			this.updateSavedItem = updateSavedItem
		}

	}

	enum HeaderCard {

		INFO,
		CENTRE,
		VEHICLE

	}

}
