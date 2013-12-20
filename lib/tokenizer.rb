require 'rubygems'
require 'logger'

require 'date'
#by Gilad Manor
class Tokenizer 
  
  def self.get_token(object)
    timestamp = Time.now.to_datetime.strftime "%j-%k-%M-%N"
    token_id =  "#{timestamp}#{object.class.name}#{object.to_s.hash}"
    Rails.cache.write(token_id,{:time=>Time.now, :data=>object})
    token
  end
  
  def self.use_token(token_id,time_limit=60)
    token = Rails.cache.read(token_id) 
    Rails.cache.delete(token_id)
    token.nil? || (Time.now - token[:time] < time_limit)) ? nil : token[:data] 
  end
  
end
