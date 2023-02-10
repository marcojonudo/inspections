package inspections.domains

import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import groovy.transform.TupleConstructor
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem
import inspections.utils.Utils
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
	Integer duration

	@JsonInclude
	Set<SavedItem> items

	static hasMany = [items: SavedItem, data: SavedInspectionData]

	static mapping = {
		items fetch: 'join'
		data fetch: 'join'
	}

	static constraints = {
		duration nullable: true
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

	SavedInspectionData findData() {
		return data.max { it.saved }
	}

	boolean updatedOrder(String type, boolean orderInspection) {
		return this.inspectionTypeCode != type || this.orderInspection != orderInspection
	}

}
