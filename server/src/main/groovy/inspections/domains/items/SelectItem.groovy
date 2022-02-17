package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class SelectItem extends Item implements GormEntity<SelectItem> {

	Set<SelectItemOption> options

	static hasMany = [options: SelectItemOption]

	static mapping = {
		options fetch: 'join', joinTable: [name: 'select_item_options']
	}

}
