package inspections.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class TextSavedItemData extends SavedItemData implements GormEntity<TextSavedItemData> {

	static hasMany = [fields: TextSavedItemDataField]

	static mapping = {
		fields fetch: 'join'
	}

	SavedItemData fill(SavedItem savedItem) {
		fields.each { it.textSavedItemData = this }
		return fillSavedItem(savedItem)
	}

}
