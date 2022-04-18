package inspections.domains.savedItems

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import grails.gorm.annotation.Entity
import inspections.domains.SavedInspection
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
abstract class SavedItem implements GormEntity<SavedItem> {

	@JsonIgnore
	SavedInspection savedInspection

	String itemCode
	String employeeCode
	boolean hidden
	Long imageId

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	@JsonDeserialize(using = LocalDateTimeDeserializer)
	@JsonSerialize(using = LocalDateTimeSerializer)
	LocalDateTime filled

	boolean restrictive

	static belongsTo = SavedInspection

	static constraints = {
		itemCode nullable: true
		filled nullable: true
		imageId nullable: true
	}

	static mapping = {
		tablePerHierarchy false
	}

	abstract void fillRelations()

	abstract boolean equals(SavedItem savedItem)

	boolean equalsSaveItem(SavedItem savedItem) {
		return hidden == savedItem.hidden && imageId == savedItem.imageId && restrictive == savedItem.restrictive
	}

}
