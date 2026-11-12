using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Priority1.ToDo.Core.Data;

// SQL Server's datetime2 has no time zone, so EF reads values back as
// DateTimeKind.Unspecified and they serialize without a trailing "Z".
// Every DateTime this app saves is UTC (see AppDbContext.BeforeSaveChanges),
// so mark values read from the database as UTC to match.
public class UtcDateTimeConverter : ValueConverter<DateTime, DateTime>
{
    public UtcDateTimeConverter()
        : base(
            toDatabase => toDatabase,
            fromDatabase => DateTime.SpecifyKind(fromDatabase, DateTimeKind.Utc))
    {
    }
}
