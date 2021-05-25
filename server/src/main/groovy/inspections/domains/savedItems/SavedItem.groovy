package inspections.domains.savedItems

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import grails.gorm.annotation.Entity
import inspections.deserializers.SavedItemDeserializer
import inspections.domains.SavedInspection
import inspections.domains.items.Item
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
@JsonDeserialize(using = SavedItemDeserializer)
class SavedItem implements GormEntity<SavedItem> {

	Item item
	String employeeCode

	LocalDateTime filled

	static belongsTo = [savedInspection: SavedInspection]

	static mapping = {
		tablePerHierarchy false
	}

}
