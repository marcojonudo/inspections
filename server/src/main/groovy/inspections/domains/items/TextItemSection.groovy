package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class TextItemSection implements GormEntity<TextItemSection> {

	@JsonIgnore
	TextItem item

	String name
	String text

}
