package inspections.domains.savedItems


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class SelectSavedItem extends SavedItem implements GormEntity<SelectSavedItem> {

	String value

	void fillRelations() {}

	boolean equals(SavedItem savedItem) {
		return equalsSaveItem(savedItem) && value == ((SelectSavedItem) savedItem).value
	}

}
