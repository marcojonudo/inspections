package inspections.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class SelectSavedItemData extends SavedItemData implements GormEntity<SelectSavedItemData> {

	String value

	boolean isCorrect() {
		return value == Constants.CORRECT_SELECT_OPTION
	}

	SavedItemData fill(SavedItem savedItem) {
		return fillSavedItem(savedItem)
	}

}
