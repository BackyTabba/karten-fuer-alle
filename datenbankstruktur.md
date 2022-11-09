# Datenbankstruktur Toolkit:
## Toolkit_createdTools
- Name
- Parameter (vielleicht primärschlüssel?)
- Wenn schon existiert, name hinzufügen?
## __Toolkit_parameter__
- parameterName
- parameterContent
- required_pre
- required_after__
# Datenbankstruktur Tool:
## nameApplikation_content
- Id: Leafletid
- objekt: Object
- If existing update, else create?
## nameApplikation_history
- nur Logfunktionen, 
- id=leafletid, welche hoffentlich unique ist.
- Werte: domainOperation (required)
- Value_pre: vorheriger Wert
- Value_post: neuer Wert
## nameApplikation_domainoperations
- domainOperations, aus schema gewinnen (input txt)
- neue hinzufügen kann möglich sein, löschen nicht
