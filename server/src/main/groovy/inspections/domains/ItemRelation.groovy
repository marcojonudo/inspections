package inspections.domains

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import grails.gorm.annotation.Entity
import inspections.deserializers.ItemDeserializer
import inspections.domains.items.Item
import org.grails.datastore.gorm.GormEntity

@Entity
class ItemRelation implements GormEntity<ItemRelation> {

	@JsonIgnore
	@JsonDeserialize(using = ItemDeserializer)
	Item item
	String matchText

	@JsonDeserialize(using = ItemDeserializer)
	Item targetItem
	Action action

	static mapping = {
		targetItem fetch: 'join'
	}

	enum Action {

		HIDE,
		REPLICATE

	}

}
