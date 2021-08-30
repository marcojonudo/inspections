package inspections.domains

import com.fasterxml.jackson.annotation.JsonFormat
import grails.gorm.annotation.Entity
import inspections.domains.savedItems.SavedItem
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
class SavedInspection implements GormEntity<SavedInspection> {

	String code
	String name
	int orderNumber
	String employeeCode
	String numberPlate
	State state

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	LocalDateTime saved

	static hasMany = [items: SavedItem]

	static constraints = {
		name maxSize: 45
	}

	static mapping = {
		items fetch: 'join'
	}

	enum State {

		STARTED({ Set<SavedItem> items -> items.find { it.item.required && !it.filled } as boolean }),
		FINISHED({ Set<SavedItem> items -> !items.find { it.item.required && !it.filled } as boolean })

		final Closure<Boolean> check

		State(Closure<Boolean> check) {
			this.check = check;
		}

	}

}
