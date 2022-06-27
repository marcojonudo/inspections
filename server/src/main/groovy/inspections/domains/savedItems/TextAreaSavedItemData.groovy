package inspections.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class TextAreaSavedItemData extends SavedItemData implements GormEntity<TextAreaSavedItemData> {

	String text

	static constraints = {
		text nullable: true
	}

	SavedItemData fill(SavedItem savedItem) {
		return fillSavedItem(savedItem)
	}

}
