package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity
import org.grails.datastore.mapping.core.connections.ConnectionSource

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class TextItemField implements GormEntity<TextItemField> {

    @JsonIgnore
    TextItem textItem

    String placeholder
    String separator
    String prefix
    String inputType
    boolean select
    Integer maxLength
    int order

    @JsonInclude
    Set<TextItemFieldValue> values

    static hasMany = [values: TextItemFieldValue]

    static constraints = {
        placeholder nullable: true
        separator nullable: true
        prefix nullable: true
        maxLength nullable: true
    }

    static mapping = {
        order column: '`order`'
        values fetch: 'join'
    }

}
