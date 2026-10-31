using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddEventAttendeeNotificationTrigger : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                                 CREATE OR REPLACE FUNCTION notify_new_event_attendee()
                                 RETURNS TRIGGER
                                 AS $$
                                 DECLARE 
                                    current_event_id INT;
                                 BEGIN
                                    SELECT "Id"
                                    INTO current_event_id
                                    FROM "Events"
                                    WHERE "EventDate"::date = 
                                           (NOW() AT TIME ZONE 'America/Chicago')::date
                                    LIMIT 1;
                                    
                                    IF current_event_id IS NOT NULL
                                       AND (NOW() AT TIME ZONE 'America/Chicago')::time >= '12:45'
                                    THEN
                                       INSERT INTO "EventNotifications"
                                          ("EventId","AttendeeId","EmailNotificationSent")
                                       VALUES
                                          (current_event_id, NEW."Id", FALSE)
                                       ON CONFLICT ("EventId", "AttendeeId") DO NOTHING;
                                    END IF;
                                 
                                    RETURN NEW;
                                 END;
                                 $$ LANGUAGE plpgsql;
                                 
                                 CREATE TRIGGER trg_new_event_attendee_notification
                                 AFTER INSERT on "EventAttendees"
                                 FOR EACH ROW
                                 EXECUTE FUNCTION notify_new_event_attendee();
                                 """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
