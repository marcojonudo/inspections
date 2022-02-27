package inspections.domains


import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import inspections.domains.items.Item
import org.grails.datastore.gorm.GormEntity
import org.grails.datastore.mapping.core.connections.ConnectionSource

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class ItemRelation implements GormEntity<ItemRelation> {

	String itemCode
	String matchText
	String targetItemCode
	Action action

	enum Action {

		HIDE,
		REPLICATE

	}

}
