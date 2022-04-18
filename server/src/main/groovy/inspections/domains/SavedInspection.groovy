package inspections.domains

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import grails.gorm.annotation.Entity
import groovy.transform.TupleConstructor
import inspections.deserializers.SavedItemsDeserializer
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem
import inspections.utils.Constants
import inspections.utils.Utils
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
@TupleConstructor
class SavedInspection implements GormEntity<SavedInspection> {

	String inspectionTypeCode
	String vehicle
	int orderNumber
	String employeeCode
	String numberPlate
	State state
	boolean orderInspection

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	@JsonSerialize(using = LocalDateTimeSerializer)
	LocalDateTime saved

	@JsonDeserialize(using = SavedItemsDeserializer)
	Set<SavedItem> items

	static hasMany = [items: SavedItem]

	static mapping = {
		items fetch: 'join'
	}

	enum State {

		STARTED({ Set<SavedItem> savedItems, List<Item> items ->
			savedItems.find { Utils.findItem(items, it.itemCode).required && !it.filled } as boolean
		}),
		FINISHED({ Set<SavedItem> savedItems, List<Item> items ->
			!savedItems.find { Utils.findItem(items, it.itemCode).required && !it.filled } as boolean
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
