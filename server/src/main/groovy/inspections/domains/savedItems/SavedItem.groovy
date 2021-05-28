package inspections.domains.savedItems

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import grails.gorm.annotation.Entity
import inspections.deserializers.SavedItemDeserializer
import inspections.domains.SavedInspection
import inspections.domains.items.Item
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
@JsonDeserialize(using = SavedItemDeserializer)
class SavedItem implements GormEntity<SavedItem> {

	@JsonIgnore
	SavedInspection savedInspection

	Item item
	String employeeCode

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	LocalDateTime filled

	static belongsTo = SavedInspection

	static mapping = {
		tablePerHierarchy false
		item fetch: 'join'
	}

}
