package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity
import org.grails.datastore.mapping.core.connections.ConnectionSource

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class TextItemFieldValue implements GormEntity<TextItemFieldValue> {

    @JsonIgnore
    TextItemField textItemField
    String value
    int order

    static mapping = {
        order column: '`order`'
    }

}
