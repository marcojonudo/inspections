package inspections.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class SelectSavedItemData extends SavedItemData implements GormEntity<SelectSavedItemData> {

	String value

	SavedItemData fill(SavedItem savedItem) {
		return fillSavedItem(savedItem)
	}

}
