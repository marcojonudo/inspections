package inspections.domains.items

import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class TextItem extends Item implements GormEntity<TextItem> {

    String placeholder
    String separator
    Integer maxLength
    String unit

    @JsonInclude
    Set<TextItemField> fields

    static hasMany = [fields: TextItemField]

    static constraints = {
        placeholder nullable: true
        separator nullable: true
        maxLength nullable: true
        unit nullable: true
    }

    static mapping = {
        fields fetch: 'join'
    }

}
