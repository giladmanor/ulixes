# Delayed Job Initializer

Delayed::Worker.destroy_failed_jobs = false
Delayed::Worker.sleep_delay = 2
Delayed::Worker.max_attempts = 5
Delayed::Worker.max_run_time = 4.hour
Delayed::Worker.delay_jobs = !Rails.env.test?

if Rails.env.production? || Rails.env.development?
  # Check if the delayed job process is already running
  # Since the process loads the rails env, this file will be called over and over
  # Unless this condition is set.
  if(!File.exists?(Rails.root.join('tmp','pids', 'delayed_job.pid')))
    system "RAILS_ENV=development #{Rails.root.join('bin','delayed_job')} stop"
    system "RAILS_ENV=development #{Rails.root.join('bin','delayed_job')} -n 2 start"
    system "echo \"Starting delayed_jobs...\""
    #system "./bin/delayed_job start &"
  else
    system "echo \"delayed_jobs is running\""
  end
end

