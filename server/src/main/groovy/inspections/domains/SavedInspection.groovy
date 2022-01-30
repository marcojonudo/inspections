package inspections.domains

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer

import grails.gorm.annotation.Entity
import groovy.transform.TupleConstructor
import inspections.deserializers.SavedItemsDeserializer
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem
import org.grails.datastore.gorm.GormEntity

@Entity
@TupleConstructor
class SavedInspection implements GormEntity<SavedInspection> {

	String inspectionTypeCode
	String vehicle
	int orderNumber
	String numberPlate
	State state
	boolean orderInspection

	@JsonDeserialize(using = SavedItemsDeserializer)
	Set<SavedItem> items

	static hasMany = [items: SavedItem, data: SavedInspectionData]

	static mapping = {
		items fetch: 'join'
		data fetch: 'join'
	}

	enum State {

		STARTED({ Set<SavedItem> savedItems, List<Item> items ->
			savedItems.find { Utils.findItem(it.code, items).required && !it.data } as boolean
		}),
		FINISHED({ Set<SavedItem> savedItems, List<Item> items ->
			!savedItems.find { Utils.findItem(it.code, items).required && !it.data } as boolean
		})

		final Closure<Boolean> check

		State(Closure<Boolean> check) {
			this.check = check;
		}

	}

	boolean updatedOrder(String type, boolean orderInspection) {
		return this.inspectionTypeCode != type || this.orderInspection != orderInspection
	}

}
