package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class SelectItemOption implements GormEntity<SelectItemOption> {

	@JsonIgnore
	SelectItem item

	String name
	String icon
	int order
	boolean selected

	static mapping = {
		order column: '`order`'
	}

}
