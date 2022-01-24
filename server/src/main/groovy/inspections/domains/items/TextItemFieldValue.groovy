package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class TextItemFieldValue implements GormEntity<TextItemFieldValue> {

    @JsonIgnore
    TextItemField textItemField
    String value
    int order

    static mapping = {
        order column: '`order`'
    }

}
