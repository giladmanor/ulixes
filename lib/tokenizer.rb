require 'rubygems'
require 'logger'
require 'date'

#by Gilad Manor
class Tokenizer
  @@cache = ActiveSupport::Cache::MemoryStore.new(expires_in: 1.minute)
  def self.get_token(object)
    timestamp = Time.now.to_datetime.strftime "%j-%k-%M-%N"
    token_id =  "#{timestamp}#{object.class.name}#{object.to_s.hash}"
    @@cache.write(token_id,object)
    puts "="*50
    puts token_id
    puts @@cache.exist?(token_id)
    puts "="*50
    token_id
  end

  def self.use_token(token_id,time_limit=60)
    token = @@cache.fetch(token_id)
    @@cache.delete(token_id)
    token
  end

end
