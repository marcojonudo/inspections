package inspections.domains.savedItems

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import grails.gorm.annotation.Entity
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
abstract class SavedItemData implements GormEntity<SavedItemData> {

	@JsonIgnore
	SavedItem savedItem
	String employeeCode
	boolean hidden
	boolean restrictive
	Long imageId

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	@JsonDeserialize(using = LocalDateTimeDeserializer)
	LocalDateTime filled

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	@JsonDeserialize(using = LocalDateTimeDeserializer)
	LocalDateTime saved = LocalDateTime.now()

	static belongsTo = SavedItem

	static mapping = {
		tablePerHierarchy false
	}

	static constraints = {
		imageId nullable: true
		filled nullable: true
	}

	abstract SavedItemData fill(SavedItem savedItem)

	SavedItemData fillSavedItem(SavedItem existentSavedItem) {
		return this.tap {
			savedItem = existentSavedItem
		}
	}

}
