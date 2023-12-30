import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";

const fileSystemLogRepository = new LogRepositoryImpl(
    new FileSystemDatasource(),
    // new postgreSQLLogDatasource(),
    // new mongoLogDS(),
);

export class Server {
    public static start() {
        console.log('Server started...');

        CronService.createJob(
            '*/5 * * * * *',
            () => {
                const url = 'http://localhost:3000';
                
                new CheckService(
                    fileSystemLogRepository,
                    () => console.log( `${ url } is ok` ),
                    ( error ) => console.log( error )
                ).execute( 'http://localhost:3000' );
                // new CheckService().execute( 'https://www.google.com' );
            }
        );

        // job.start();
    }
}