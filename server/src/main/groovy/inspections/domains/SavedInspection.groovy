package inspections.domains


import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import grails.gorm.annotation.Entity
import inspections.domains.savedItems.SavedItem
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
class SavedInspection implements GormEntity<SavedInspection> {

	String name
	int orderNumber

	@JsonDeserialize(using = LocalDateTimeDeserializer)
	LocalDateTime saved

	static hasMany = [items: SavedItem]

	static constraints = {
		name maxSize: 45
	}

	static mapping = {
		items fetch: 'join'
	}

}
