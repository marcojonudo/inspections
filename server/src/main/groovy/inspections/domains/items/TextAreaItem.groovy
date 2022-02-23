package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class TextAreaItem extends Item implements GormEntity<TextAreaItem> {

    boolean ownCategory

}
