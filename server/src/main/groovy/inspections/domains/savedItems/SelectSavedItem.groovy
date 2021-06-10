package inspections.domains.savedItems


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class SelectSavedItem extends SavedItem implements GormEntity<SelectSavedItem> {

	String value

	boolean equals(SavedItem savedItem) {
		return value == ((SelectSavedItem) savedItem).value
	}

}
