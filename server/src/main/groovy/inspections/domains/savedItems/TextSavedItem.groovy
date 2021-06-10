package inspections.domains.savedItems


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class TextSavedItem extends SavedItem implements GormEntity<TextSavedItem> {

	String text

	boolean equals(SavedItem savedItem) {
		return text == ((TextSavedItem) savedItem).text
	}

}
