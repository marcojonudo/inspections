package inspections.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import grails.gorm.annotation.Entity
import inspections.deserializers.SavedItemDataDeserializer
import inspections.domains.SavedInspection
import inspections.domains.items.Item
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties
class SavedItem implements GormEntity<SavedItem> {

	@JsonIgnore
	SavedInspection savedInspection

	Item.Type type
	String code
	Long imageId

	@JsonDeserialize(using = SavedItemDataDeserializer)
	Set<SavedItemData> data

	static hasMany = [data: SavedItemData]

	static belongsTo = SavedInspection

	static constraints = {
		imageId nullable: true
	}

	static mapping = {
		data fetch: 'join', column: 'saved_item_id'
	}

}
