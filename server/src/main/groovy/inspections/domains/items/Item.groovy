package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import inspections.domains.InspectionVehicle
import inspections.domains.ItemCategory
import inspections.domains.ItemRelation
import inspections.domains.savedItems.SelectSavedItemData
import inspections.domains.savedItems.TextAreaSavedItemData
import inspections.domains.savedItems.TextSavedItemData
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

	ItemVehicleData vehicleData

	static hasMany = [inspectionsVehicle: InspectionVehicle, vehicleDataList: ItemVehicleData]

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
	}

	enum Type {

		TEXT(TextItem, TextSavedItemData),
		SELECT(SelectItem, SelectSavedItemData),
		TEXT_AREA(TextAreaItem, TextAreaSavedItemData)

		Class clazz
		Class savedItemDataClazz

		Type(Class clazz, Class savedItemDataClazz) {
			this.clazz = clazz
			this.savedItemDataClazz = savedItemDataClazz
		}

	}

	enum HeaderCard {

		INFO,
		CENTRE,
		VEHICLE

	}

}
